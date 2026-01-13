/**
 * ThrustCalculatorExample.cpp
 *
 * Example usage of the RPA-based thrust calculation system
 *
 * Workflow:
 * 1. Generate RPA tables using: rpas.exe generate_rpa_tables.js
 * 2. Size your engine (set throat area)
 * 3. At each simulation timestep, calculate thrust from injector conditions
 */

#include "ThrustCalculator.h"
#include <iostream>
#include <iomanip>

int main() {
    std::cout << std::fixed << std::setprecision(2);

    // ================================================================
    // STEP 1: Create thrust calculator and load performance tables
    // ================================================================
    ThrustCalculator thrustCalc;

    std::cout << "Loading RPA performance tables..." << std::endl;
    if (!thrustCalc.loadPerformanceTable("rpa_thrust_tables.csv")) {
        std::cerr << "Error: Failed to load RPA tables!" << std::endl;
        std::cerr << "Make sure to run: rpas.exe generate_rpa_tables.js" << std::endl;
        return 1;
    }
    std::cout << "Tables loaded successfully!\n" << std::endl;


    // ================================================================
    // STEP 2: Size the engine
    // ================================================================
    // Option A: Set throat area directly (if you already know it)
    thrustCalc.setThroatArea(5.5);  // 5.5 square inches

    /*
    // Option B: Size from design point (recommended)
    std::cout << "Sizing engine from design point..." << std::endl;
    double F_design = 5000.0;   // Design thrust: 5000 lbf
    double Pc_design = 500.0;   // Design chamber pressure: 500 psi
    double OF_design = 2.0;     // Design mixture ratio: 2.0
    double Pa_design = 14.7;    // Sea level

    thrustCalc.sizeEngineFromDesignPoint(F_design, Pc_design, OF_design, Pa_design);
     
    std::cout << "Engine sized!" << std::endl;
    std::cout << "  Throat area: " << thrustCalc.getThroatArea() << " in^2\n" << std::endl;
     */

    // ================================================================
    // STEP 3: Simulate thrust at different operating conditions
    // ================================================================
    std::cout << "Simulating thrust at various operating conditions:\n" << std::endl;
    std::cout << std::setw(8) << "Pc (psi)"
              << std::setw(12) << "mdot_ox"
              << std::setw(12) << "mdot_fuel"
              << std::setw(8) << "O/F"
              << std::setw(10) << "Pa (psi)"
              << std::setw(12) << "Thrust (lbf)"
              << std::setw(8) << "Cf"
              << std::setw(10) << "Isp (s)"
              << std::endl;
    std::cout << std::string(80, '-') << std::endl;

    // Simulate different timesteps with varying conditions
    struct TestCondition {
        double Pc;
        double mdot_ox;
        double mdot_fuel;
        double Pa;
    };

    TestCondition conditions[] = {
        // Pc    mdot_ox  mdot_fuel  Pa
        {500.0,  10.0,    5.0,      14.7},  // Sea level, design point
        {450.0,   9.0,    4.5,      14.7},  // Slightly lower
        {550.0,  11.0,    5.5,      14.7},  // Slightly higher
        {500.0,  10.0,    5.0,       5.0},  // Higher altitude
        {500.0,  10.0,    5.0,       0.0},  // Vacuum
        {300.0,   6.0,    3.0,      14.7},  // Lower chamber pressure
        {700.0,  14.0,    7.0,      14.7},  // Higher chamber pressure
    };

    for (const auto& cond : conditions) {
        try {
            // Calculate thrust
            double thrust = thrustCalc.calculateThrust(cond.Pc, cond.mdot_ox,
                                                      cond.mdot_fuel, cond.Pa);

            // Get performance details
            auto perf = thrustCalc.getLastPerformanceData();
            double OF = cond.mdot_ox / cond.mdot_fuel;

            std::cout << std::setw(8) << cond.Pc
                      << std::setw(12) << cond.mdot_ox
                      << std::setw(12) << cond.mdot_fuel
                      << std::setw(8) << OF
                      << std::setw(10) << cond.Pa
                      << std::setw(12) << thrust
                      << std::setw(8) << perf.Cf
                      << std::setw(10) << perf.Isp
                      << std::endl;

        } catch (const std::exception& e) {
            std::cerr << "Error: " << e.what() << std::endl;
        }
    }

    std::cout << "\n" << std::string(80, '-') << "\n" << std::endl;


    // ================================================================
    // STEP 4: Integration with flight simulator
    // ================================================================
    std::cout << "Integration example for flight simulator:\n" << std::endl;
    std::cout << "// At each timestep in your flight sim:" << std::endl;
    std::cout << "void FlightSim::timestep(double dt) {" << std::endl;
    std::cout << "    // 1. Your injector/feed system model gives you:" << std::endl;
    std::cout << "    double Pc = injector.getChamberPressure();" << std::endl;
    std::cout << "    double mdot_ox = injector.getOxidizerFlowRate();" << std::endl;
    std::cout << "    double mdot_fuel = injector.getFuelFlowRate();" << std::endl;
    std::cout << "    double Pa = atmosphere.getPressure(altitude);" << std::endl;
    std::cout << "" << std::endl;
    std::cout << "    // 2. Calculate thrust" << std::endl;
    std::cout << "    double thrust = thrustCalc.calculateThrust(Pc, mdot_ox, mdot_fuel, Pa);" << std::endl;
    std::cout << "" << std::endl;
    std::cout << "    // 3. Use thrust in dynamics" << std::endl;
    std::cout << "    Force thrustForce(thrust, 0, 0, ROCKET_FRAME);" << std::endl;
    std::cout << "    applyForce(thrustForce);" << std::endl;
    std::cout << "}" << std::endl;


    // ================================================================
    // Notes and recommendations
    // ================================================================
    std::cout << "\n" << std::string(80, '=') << std::endl;
    std::cout << "NOTES:" << std::endl;
    std::cout << "1. RPA tables must cover your operating range (Pc, O/F, Pa)" << std::endl;
    std::cout << "2. Interpolation is used between table points" << std::endl;
    std::cout << "3. Values outside table range are clamped to nearest edge" << std::endl;
    std::cout << "4. For optimal accuracy, generate dense tables around your operating point" << std::endl;
    std::cout << "5. Thrust equation: F = Cf × Pc × At" << std::endl;
    std::cout << "6. Units: Pc (psi), At (in^2), F (lbf), mdot (lbm/s)" << std::endl;
    std::cout << std::string(80, '=') << std::endl;

    return 0;
}
