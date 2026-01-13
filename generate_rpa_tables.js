/***************************************************
 RPA Table Generator for Flight Simulation

 This script generates lookup tables for thrust calculations:
 - Cf (thrust coefficient)
 - C* (characteristic velocity)
 - Isp (specific impulse)
 - Exit velocity (Ve)
 - Exit pressure (Pe)

 Tables are generated across ranges of:
 - Chamber pressure (Pc)
 - Mixture ratio (O/F)
 - Ambient pressure (Pa)

 Output: CSV file with columns: Pc,OF,Pa,Cf,Cstar,Isp,Ve,Pe
****************************************************/

// Configuration - MODIFY THESE FOR YOUR PROPELLANTS AND RANGES
var CONFIG = {
    // Propellants
    oxidizer: "N2O4(L)",           // N2O4, LOX, etc.
    fuel: "UDMH",                  // UDMH, RP-1, LH2, etc.

    // Ranges for table generation
    Pc_min: 100,                   // psi
    Pc_max: 1000,                  // psi
    Pc_steps: 20,

    OF_min: 1.0,                   // mixture ratio
    OF_max: 3.5,
    OF_steps: 15,

    Pa_min: 0,                     // psi (0 = vacuum)
    Pa_max: 14.7,                  // psi (14.7 = sea level)
    Pa_steps: 6,

    // Engine geometry (if you want fixed geometry)
    // Leave null to recalculate optimal expansion for each condition
    expansion_ratio: 10.0,         // Area ratio (Ae/At)

    // Output file
    output_file: "rpa_thrust_tables.csv"
};


//*********************************
// Generate range of values
function linspace(start, end, steps) {
    var arr = [];
    var step = (end - start) / (steps - 1);
    for (var i = 0; i < steps; i++) {
        arr.push(start + step * i);
    }
    return arr;
}


//*********************************
// Main table generation
function generateTables() {

    // Generate ranges
    var Pc_range = linspace(CONFIG.Pc_min, CONFIG.Pc_max, CONFIG.Pc_steps);
    var OF_range = linspace(CONFIG.OF_min, CONFIG.OF_max, CONFIG.OF_steps);
    var Pa_range = linspace(CONFIG.Pa_min, CONFIG.Pa_max, CONFIG.Pa_steps);

    // Open output file
    var file = new File(CONFIG.output_file);
    file.open(File.WriteOnly);

    // Write header
    file.writeLine("Pc_psi,OF,Pa_psi,Cf,Cstar_ms,Isp_s,Ve_ms,Pe_psi,Gamma");

    print("Generating RPA thrust tables...");
    print("Total calculations: " + (Pc_range.length * OF_range.length * Pa_range.length));

    var count = 0;

    // Loop through all combinations
    for (var i = 0; i < Pc_range.length; i++) {
        var Pc = Pc_range[i];

        for (var j = 0; j < OF_range.length; j++) {
            var OF = OF_range[j];

            for (var k = 0; k < Pa_range.length; k++) {
                var Pa = Pa_range[k];

                // Create performance object for this condition
                var perf = Performance();

                // Set propellants
                var prop = Propellant();
                prop.setOxidizer(CONFIG.oxidizer);
                prop.setFuel(CONFIG.fuel);
                prop.setMr(OF);
                perf.setPropellant(prop);

                // Set chamber conditions
                var chamber = Chamber();
                chamber.setP(Pc, "psi");
                perf.setChamber(chamber);

                // Set nozzle conditions
                var nozzle = Nozzle();
                nozzle.setModel(Nozzle.SHIFTING);

                if (CONFIG.expansion_ratio !== null) {
                    nozzle.setAeAt(CONFIG.expansion_ratio);
                } else {
                    // Optimal expansion for this ambient pressure
                    nozzle.setOptimization(true);
                }

                nozzle.setPa(Pa, "psi");
                perf.setNozzle(nozzle);

                // Solve performance
                try {
                    perf.solve();

                    // Extract results
                    var chamber_result = perf.getChamber();
                    var nozzle_result = perf.getNozzle();

                    var Cf = perf.getCf();
                    var Cstar = chamber_result.getReaction(0).getCstar("m/s");
                    var Isp = perf.getIsp("s");
                    var Ve = nozzle_result.getSection(1).getV("m/s");
                    var Pe = nozzle_result.getSection(1).getP("psi");
                    var gamma = chamber_result.getReaction(0).getK();

                    // Write to file
                    var line = Pc + "," + OF + "," + Pa + "," +
                               Cf + "," + Cstar + "," + Isp + "," +
                               Ve + "," + Pe + "," + gamma;
                    file.writeLine(line);

                    count++;
                    if (count % 100 == 0) {
                        print("Completed: " + count + " calculations");
                    }

                } catch (e) {
                    print("Warning: Failed at Pc=" + Pc + ", OF=" + OF + ", Pa=" + Pa);
                    print("Error: " + e);
                }
            }
        }
    }

    file.close();

    print("\nTable generation complete!");
    print("Total entries: " + count);
    print("Output file: " + CONFIG.output_file);
}


// Run the generator
generateTables();
