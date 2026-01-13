#include "RPATableInterpolator.h"
#include <fstream>
#include <sstream>
#include <algorithm>
#include <stdexcept>
#include <cmath>
#include <set>

RPATableInterpolator::RPATableInterpolator() : m_isLoaded(false) {
}

RPATableInterpolator::~RPATableInterpolator() {
}

bool RPATableInterpolator::loadTable(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        return false;
    }

    m_table.clear();
    m_Pc_values.clear();
    m_OF_values.clear();
    m_Pa_values.clear();
    m_indexMap.clear();

    std::string line;

    // Skip header line
    std::getline(file, line);

    // Read data lines
    while (std::getline(file, line)) {
        if (line.empty()) continue;

        std::istringstream ss(line);
        std::string token;
        std::vector<double> values;

        // Parse CSV line
        while (std::getline(ss, token, ',')) {
            try {
                values.push_back(std::stod(token));
            } catch (...) {
                continue; // Skip malformed lines
            }
        }

        // Expected format: Pc,OF,Pa,Cf,Cstar,Isp,Ve,Pe,Gamma
        if (values.size() < 9) continue;

        TableEntry entry;
        entry.Pc = values[0];
        entry.OF = values[1];
        entry.Pa = values[2];
        entry.data.Cf = values[3];
        entry.data.Cstar = values[4];
        entry.data.Isp = values[5];
        entry.data.Ve = values[6];
        entry.data.Pe = values[7];
        entry.data.gamma = values[8];

        m_table.push_back(entry);
    }

    file.close();

    if (m_table.empty()) {
        return false;
    }

    // Build interpolation structure
    buildInterpolationStructure();

    m_isLoaded = true;
    return true;
}

void RPATableInterpolator::buildInterpolationStructure() {
    // Extract unique sorted values for each axis
    std::set<double> Pc_set, OF_set, Pa_set;

    for (const auto& entry : m_table) {
        Pc_set.insert(entry.Pc);
        OF_set.insert(entry.OF);
        Pa_set.insert(entry.Pa);
    }

    m_Pc_values.assign(Pc_set.begin(), Pc_set.end());
    m_OF_values.assign(OF_set.begin(), OF_set.end());
    m_Pa_values.assign(Pa_set.begin(), Pa_set.end());

    // Build index map for fast lookup
    for (size_t i = 0; i < m_table.size(); ++i) {
        const auto& entry = m_table[i];

        // Find indices
        auto it_Pc = std::lower_bound(m_Pc_values.begin(), m_Pc_values.end(), entry.Pc);
        auto it_OF = std::lower_bound(m_OF_values.begin(), m_OF_values.end(), entry.OF);
        auto it_Pa = std::lower_bound(m_Pa_values.begin(), m_Pa_values.end(), entry.Pa);

        int Pc_idx = std::distance(m_Pc_values.begin(), it_Pc);
        int OF_idx = std::distance(m_OF_values.begin(), it_OF);
        int Pa_idx = std::distance(m_Pa_values.begin(), it_Pa);

        m_indexMap[{Pc_idx, OF_idx, Pa_idx}] = i;
    }
}

void RPATableInterpolator::findBounds(const std::vector<double>& values, double value,
                                      int& idx0, int& idx1, double& t) const {
    // Clamp to table bounds
    if (value <= values.front()) {
        idx0 = idx1 = 0;
        t = 0.0;
        return;
    }
    if (value >= values.back()) {
        idx0 = idx1 = values.size() - 1;
        t = 0.0;
        return;
    }

    // Binary search for upper bound
    auto it = std::upper_bound(values.begin(), values.end(), value);
    idx1 = std::distance(values.begin(), it);
    idx0 = idx1 - 1;

    // Calculate interpolation factor
    double v0 = values[idx0];
    double v1 = values[idx1];
    t = (value - v0) / (v1 - v0);
}

double RPATableInterpolator::trilinearInterp(double c000, double c001, double c010, double c011,
                                             double c100, double c101, double c110, double c111,
                                             double tx, double ty, double tz) const {
    // Interpolate along x (Pc)
    double c00 = c000 * (1.0 - tx) + c100 * tx;
    double c01 = c001 * (1.0 - tx) + c101 * tx;
    double c10 = c010 * (1.0 - tx) + c110 * tx;
    double c11 = c011 * (1.0 - tx) + c111 * tx;

    // Interpolate along y (OF)
    double c0 = c00 * (1.0 - ty) + c10 * ty;
    double c1 = c01 * (1.0 - ty) + c11 * ty;

    // Interpolate along z (Pa)
    double c = c0 * (1.0 - tz) + c1 * tz;

    return c;
}

const RPATableInterpolator::TableEntry* RPATableInterpolator::getEntry(int Pc_idx, int OF_idx, int Pa_idx) const {
    auto it = m_indexMap.find({Pc_idx, OF_idx, Pa_idx});
    if (it != m_indexMap.end()) {
        return &m_table[it->second];
    }
    return nullptr;
}

RPATableInterpolator::PerformanceData RPATableInterpolator::getPerformance(double Pc, double OF, double Pa) const {
    if (!m_isLoaded) {
        throw std::runtime_error("RPA table not loaded");
    }

    // Find bounding indices and interpolation factors
    int Pc_idx0, Pc_idx1, OF_idx0, OF_idx1, Pa_idx0, Pa_idx1;
    double tx, ty, tz;

    findBounds(m_Pc_values, Pc, Pc_idx0, Pc_idx1, tx);
    findBounds(m_OF_values, OF, OF_idx0, OF_idx1, ty);
    findBounds(m_Pa_values, Pa, Pa_idx0, Pa_idx1, tz);

    // Get 8 corner values (vertices of the interpolation cube)
    const TableEntry* e000 = getEntry(Pc_idx0, OF_idx0, Pa_idx0);
    const TableEntry* e001 = getEntry(Pc_idx0, OF_idx0, Pa_idx1);
    const TableEntry* e010 = getEntry(Pc_idx0, OF_idx1, Pa_idx0);
    const TableEntry* e011 = getEntry(Pc_idx0, OF_idx1, Pa_idx1);
    const TableEntry* e100 = getEntry(Pc_idx1, OF_idx0, Pa_idx0);
    const TableEntry* e101 = getEntry(Pc_idx1, OF_idx0, Pa_idx1);
    const TableEntry* e110 = getEntry(Pc_idx1, OF_idx1, Pa_idx0);
    const TableEntry* e111 = getEntry(Pc_idx1, OF_idx1, Pa_idx1);

    // Check if all corners exist (handle edge cases)
    if (!e000 || !e001 || !e010 || !e011 || !e100 || !e101 || !e110 || !e111) {
        // Fallback: return nearest neighbor
        if (e000) return e000->data;
        throw std::runtime_error("Unable to interpolate: missing table entries");
    }

    // Perform trilinear interpolation for each parameter
    PerformanceData result;

    result.Cf = trilinearInterp(
        e000->data.Cf, e001->data.Cf, e010->data.Cf, e011->data.Cf,
        e100->data.Cf, e101->data.Cf, e110->data.Cf, e111->data.Cf,
        tx, ty, tz
    );

    result.Cstar = trilinearInterp(
        e000->data.Cstar, e001->data.Cstar, e010->data.Cstar, e011->data.Cstar,
        e100->data.Cstar, e101->data.Cstar, e110->data.Cstar, e111->data.Cstar,
        tx, ty, tz
    );

    result.Isp = trilinearInterp(
        e000->data.Isp, e001->data.Isp, e010->data.Isp, e011->data.Isp,
        e100->data.Isp, e101->data.Isp, e110->data.Isp, e111->data.Isp,
        tx, ty, tz
    );

    result.Ve = trilinearInterp(
        e000->data.Ve, e001->data.Ve, e010->data.Ve, e011->data.Ve,
        e100->data.Ve, e101->data.Ve, e110->data.Ve, e111->data.Ve,
        tx, ty, tz
    );

    result.Pe = trilinearInterp(
        e000->data.Pe, e001->data.Pe, e010->data.Pe, e011->data.Pe,
        e100->data.Pe, e101->data.Pe, e110->data.Pe, e111->data.Pe,
        tx, ty, tz
    );

    result.gamma = trilinearInterp(
        e000->data.gamma, e001->data.gamma, e010->data.gamma, e011->data.gamma,
        e100->data.gamma, e101->data.gamma, e110->data.gamma, e111->data.gamma,
        tx, ty, tz
    );

    return result;
}

void RPATableInterpolator::getBounds(double& Pc_min, double& Pc_max,
                                     double& OF_min, double& OF_max,
                                     double& Pa_min, double& Pa_max) const {
    if (!m_isLoaded) {
        throw std::runtime_error("RPA table not loaded");
    }

    Pc_min = m_Pc_values.front();
    Pc_max = m_Pc_values.back();
    OF_min = m_OF_values.front();
    OF_max = m_OF_values.back();
    Pa_min = m_Pa_values.front();
    Pa_max = m_Pa_values.back();
}
