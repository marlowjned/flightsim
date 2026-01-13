#include "ThrustCalculator.h"
#include <stdexcept>
#include <cmath>

ThrustCalculator::ThrustCalculator()
    : m_tableInterpolator(nullptr)
    , m_At_in2(0.0) {
}

ThrustCalculator::~ThrustCalculator() {
}

bool ThrustCalculator::loadPerformanceTable(const std::string& table_filename) {
    m_tableInterpolator = std::make_unique<RPATableInterpolator>();
    return m_tableInterpolator->loadTable(table_filename);
}

void ThrustCalculator::setThroatArea(double At_in2) {
    if (At_in2 <= 0.0) {
        throw std::invalid_argument("Throat area must be positive");
    }
    m_At_in2 = At_in2;
}

void ThrustCalculator::sizeEngineFromDesignPoint(double F_design, double Pc_design,
                                                 double OF_design, double Pa_design) {
    if (!m_tableInterpolator || !m_tableInterpolator->isValid()) {
        throw std::runtime_error("Performance table not loaded");
    }

    // Get Cf at design point
    auto perf = m_tableInterpolator->getPerformance(Pc_design, OF_design, Pa_design);
    double Cf_design = perf.Cf;

    // Calculate required throat area
    // F = Cf × Pc × At
    // At = F / (Cf × Pc)
    m_At_in2 = F_design / (Cf_design * Pc_design);
}

double ThrustCalculator::calculateThrust(double Pc, double mdot_ox, double mdot_fuel, double Pa) {
    if (!isReady()) {
        throw std::runtime_error("ThrustCalculator not ready: load table and set throat area");
    }

    // Calculate mixture ratio
    double mdot_total = mdot_ox + mdot_fuel;
    if (mdot_fuel <= 0.0) {
        throw std::invalid_argument("Fuel mass flow rate must be positive");
    }
    double OF = mdot_ox / mdot_fuel;

    // Get performance data from tables
    m_lastPerformance = m_tableInterpolator->getPerformance(Pc, OF, Pa);

    // Calculate thrust using chamber pressure equation
    // F = Cf × Pc × At
    double F_lbf = m_lastPerformance.Cf * Pc * m_At_in2;

    return F_lbf;
}

double ThrustCalculator::calculateThrustFromMassFlow(double mdot_total, double OF, double Pa) {
    if (!isReady()) {
        throw std::runtime_error("ThrustCalculator not ready: load table and set throat area");
    }

    // For mass flow based calculation, we need to estimate Pc
    // This is an iterative problem, but we can use a typical Pc or
    // calculate it from the relationship: Pc = mdot × C* / At

    // We'll use a reference Pc (middle of table range) to get C* and Cf
    double Pc_min, Pc_max, OF_min, OF_max, Pa_min, Pa_max;
    m_tableInterpolator->getBounds(Pc_min, Pc_max, OF_min, OF_max, Pa_min, Pa_max);

    // Start with mid-range Pc as initial guess
    double Pc_guess = (Pc_min + Pc_max) / 2.0;

    // Iterate to find consistent Pc
    // Equation: Pc × At = mdot × C*
    const int max_iterations = 10;
    const double tolerance = 0.01; // 1% tolerance

    for (int i = 0; i < max_iterations; ++i) {
        m_lastPerformance = m_tableInterpolator->getPerformance(Pc_guess, OF, Pa);

        // Calculate Pc from mass flow and C*
        // Pc = mdot × C* / At
        // Note: Need to handle unit conversion: C* is in m/s, mdot in lbm/s, At in in^2
        // Using: 1 lbf = 1 lbm × 1 ft/s^2 / 32.174
        //        1 psi = 1 lbf/in^2

        double Cstar_fts = m_lastPerformance.Cstar * 3.28084;  // m/s to ft/s
        double Pc_calculated = (mdot_total * Cstar_fts) / (32.174 * m_At_in2);

        // Check convergence
        double error = std::abs(Pc_calculated - Pc_guess) / Pc_guess;
        if (error < tolerance) {
            Pc_guess = Pc_calculated;
            break;
        }

        // Update guess (simple averaging)
        Pc_guess = 0.5 * (Pc_guess + Pc_calculated);
    }

    // Calculate thrust: F = Cf × Pc × At
    double F_lbf = m_lastPerformance.Cf * Pc_guess * m_At_in2;

    return F_lbf;
}
