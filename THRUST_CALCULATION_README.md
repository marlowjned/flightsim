# RPA-Based Thrust Calculation System

This system calculates rocket engine thrust using RPA (Rocket Propulsion Analysis) performance tables and the chamber pressure equation.

## Overview

### Thrust Equation
```
F = Cf × Pc × At
```

Where:
- **F** = Thrust (lbf)
- **Cf** = Thrust coefficient (dimensionless, from RPA tables)
- **Pc** = Chamber pressure (psi, from your injector/feed model)
- **At** = Throat area (in², from engine sizing)

### Why This Approach?

The thrust coefficient **Cf** varies with operating conditions:
- **O/F ratio**: Changes combustion temperature and gas properties
- **Chamber pressure**: Affects combustion efficiency
- **Ambient pressure**: Influences pressure thrust component

By pre-generating RPA tables across these parameters, we can efficiently interpolate Cf at each timestep without running full RPA calculations during simulation.

## Files

### 1. `generate_rpa_tables.js`
JavaScript script that uses RPA to generate performance lookup tables.

**Configuration variables** (edit these for your propellants):
```javascript
oxidizer: "N2O4(L)"          // Your oxidizer
fuel: "UDMH"                 // Your fuel
Pc_min/max: 100-1000 psi    // Chamber pressure range
OF_min/max: 1.0-3.5         // Mixture ratio range
Pa_min/max: 0-14.7 psi      // Ambient pressure range (0=vacuum, 14.7=sea level)
expansion_ratio: 10.0        // Nozzle area ratio (or null for optimal)
```

**Outputs**: CSV file with columns: `Pc, O/F, Pa, Cf, C*, Isp, Ve, Pe, Gamma`

### 2. `RPATableInterpolator.h/cpp`
C++ class that loads RPA tables and performs trilinear interpolation.

**Key methods**:
- `loadTable(filename)`: Load CSV table
- `getPerformance(Pc, OF, Pa)`: Interpolate performance data
- Returns: `PerformanceData` struct with Cf, C*, Isp, Ve, Pe, gamma

### 3. `ThrustCalculator.h/cpp`
High-level thrust calculator that combines RPA tables with engine geometry.

**Key methods**:
- `loadPerformanceTable(filename)`: Load RPA tables
- `sizeEngineFromDesignPoint(F, Pc, OF, Pa)`: Calculate throat area from design point
- `setThroatArea(At)`: Manually set throat area
- `calculateThrust(Pc, mdot_ox, mdot_fuel, Pa)`: Calculate thrust at current conditions

### 4. `ThrustCalculatorExample.cpp`
Complete working example demonstrating usage.

## Quick Start

### Step 1: Generate RPA Tables

1. Edit `generate_rpa_tables.js` with your propellants and ranges
2. Run RPA in scripting mode:
   ```bash
   cd /path/to/marlowsim
   ./RPA/2.3/standard/rpas.exe generate_rpa_tables.js
   ```
3. This creates `rpa_thrust_tables.csv`

### Step 2: Size Your Engine

You have two options:

**Option A: Design from target performance**
```cpp
ThrustCalculator thrustCalc;
thrustCalc.loadPerformanceTable("rpa_thrust_tables.csv");

// Size engine for 5000 lbf at 500 psi, O/F=2.0, sea level
thrustCalc.sizeEngineFromDesignPoint(5000.0, 500.0, 2.0, 14.7);
```

**Option B: Use existing throat area**
```cpp
thrustCalc.setThroatArea(5.5);  // 5.5 in²
```

### Step 3: Calculate Thrust Each Timestep

```cpp
// Your injector model provides these:
double Pc = 480.0;           // Chamber pressure (psi)
double mdot_ox = 10.0;       // Oxidizer flow (lbm/s)
double mdot_fuel = 5.0;      // Fuel flow (lbm/s)
double Pa = 14.7;            // Ambient pressure (psi)

// Calculate thrust
double thrust = thrustCalc.calculateThrust(Pc, mdot_ox, mdot_fuel, Pa);

// Get additional performance data
auto perf = thrustCalc.getLastPerformanceData();
std::cout << "Cf = " << perf.Cf << std::endl;
std::cout << "Isp = " << perf.Isp << " s" << std::endl;
```

## Integration with Your Flight Sim

Add to your simulation loop:

```cpp
class FlightSim {
private:
    ThrustCalculator m_thrustCalc;

public:
    void initialize() {
        // Load tables once at startup
        m_thrustCalc.loadPerformanceTable("rpa_thrust_tables.csv");
        m_thrustCalc.sizeEngineFromDesignPoint(5000.0, 500.0, 2.0, 14.7);
    }

    void timestep(double dt) {
        // Get conditions from your models
        double Pc = m_engine.getChamberPressure();
        double mdot_ox = m_engine.getOxidizerFlowRate();
        double mdot_fuel = m_engine.getFuelFlowRate();
        double Pa = m_atmosphere.getPressure(m_altitude);

        // Calculate thrust
        double thrust = m_thrustCalc.calculateThrust(Pc, mdot_ox, mdot_fuel, Pa);

        // Apply to rocket dynamics
        Force thrustForce(thrust, 0, 0, ROCKET_FRAME);
        applyForce(thrustForce);

        // Update propellant masses
        m_engine.consumePropellant(mdot_ox * dt, mdot_fuel * dt);
    }
};
```

## Engine Sizing Methodology

### If Using RPA for Engine Sizing:

Use RPA GUI or scripting to:
1. Define propellants and mixture ratio
2. Set design chamber pressure
3. Set target thrust
4. Design combustion chamber → get throat area (At)
5. Design nozzle → get expansion ratio and exit area

### If Sizing Within Simulation:

```cpp
// Your design requirements
double F_target = 5000.0;    // Target thrust (lbf)
double Pc_design = 500.0;    // Design chamber pressure (psi)
double OF_design = 2.0;      // Design mixture ratio
double Pa_design = 14.7;     // Design ambient pressure (psi)

// Calculator computes required throat area
thrustCalc.sizeEngineFromDesignPoint(F_target, Pc_design, OF_design, Pa_design);

// Throat area is: At = F / (Cf × Pc)
double At = thrustCalc.getThroatArea();
```

## Important Notes

### Units
- **Pressure**: psi
- **Thrust**: lbf
- **Mass flow**: lbm/s
- **Area**: in²
- **Velocity**: m/s (in tables), converted internally
- **Isp**: seconds

### Table Coverage
- Tables MUST cover your expected operating range
- Values outside table bounds are clamped to nearest edge
- Interpolation is trilinear (smooth between points)
- Generate denser tables near your primary operating point for better accuracy

### Performance
- Table loading: ~once at startup
- Interpolation: ~fast enough for realtime simulation
- No RPA calculations during simulation

### Accuracy Considerations
1. RPA tables are pre-computed → no combustion modeling during flight
2. Assumes quasi-steady flow (good for timesteps > ~10ms)
3. Transient effects (startup, shutdown) not captured
4. Perfect mixing assumed (via O/F ratio)
5. C* efficiency and Cf correction factors can be added if needed

## Compiling Example

```bash
g++ -std=c++14 -o thrust_example \
    ThrustCalculatorExample.cpp \
    ThrustCalculator.cpp \
    RPATableInterpolator.cpp

./thrust_example
```

## Troubleshooting

**"Failed to load RPA tables"**
- Ensure `rpa_thrust_tables.csv` exists in working directory
- Check CSV format matches expected columns

**"Unable to interpolate: missing table entries"**
- Your operating conditions (Pc, O/F, Pa) are outside table range
- Regenerate tables with wider ranges

**Unrealistic thrust values**
- Check unit consistency (psi, lbf, lbm/s, in²)
- Verify throat area is reasonable (~1-100 in² for small rockets)
- Check chamber pressure is in reasonable range (100-1000 psi typical)

**"Throat area must be positive"**
- Engine not sized yet - call `sizeEngineFromDesignPoint()` or `setThroatArea()`

## References

- RPA: http://www.propulsion-analysis.com
- Thrust equation: Sutton & Biblarz, "Rocket Propulsion Elements"
- Performance tables: Standard rocket engine analysis methodology
