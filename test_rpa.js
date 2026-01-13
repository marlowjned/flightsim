// Simple test to verify RPA scripting works
print("=== RPA Test Script ===");
print("If you see this, print() works!");

// Test performance calculation
var perf = Performance();
var prop = Propellant();
prop.setOxidizer("N2O4(L)");
prop.setFuel("UDMH");
prop.setMr(2.0);
perf.setPropellant(prop);

var chamber = Chamber();
chamber.setP(500, "psi");
perf.setChamber(chamber);

var nozzle = Nozzle();
nozzle.setModel(Nozzle.SHIFTING);
nozzle.setAeAt(10.0);
nozzle.setPa(14.7, "psi");
perf.setNozzle(nozzle);

print("Solving performance...");
perf.solve();

print("Cf = " + perf.getCf());
print("Test complete!");
