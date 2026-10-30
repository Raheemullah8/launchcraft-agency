import prisma from "../src/lib/prisma";
import { getSettings, updateSettings } from "../src/lib/cms/store";

async function runSettingsValidation() {
  console.log("==================================================================");
  console.log("   GRAVITAS END-TO-END VALIDATOR: MODEL SETTING (SITE SETTINGS)   ");
  console.log("==================================================================\n");

  // PART 1: TEST getSettings() and PostgreSQL Seeding
  console.log("[1] Testing getSettings()...");
  const settings = await getSettings();
  console.log("Agency Name loaded:", settings.agencyName);
  console.log("Agency Email loaded:", settings.email);

  // Direct PostgreSQL DB Verification
  console.log("\n[2] Checking direct PostgreSQL table 'settings'...");
  const dbRecord = await prisma.setting.findUnique({
    where: { key: "site_settings" },
  });

  if (!dbRecord || !dbRecord.value) {
    throw new Error("Direct DB check failed: 'site_settings' record not found in PostgreSQL!");
  }
  const dbVal = dbRecord.value as any;
  console.log(`✓ Direct DB check verified: Key="${dbRecord.key}", Agency="${dbVal.agencyName}"`);

  // PART 2: TEST updateSettings() with customized values
  console.log("\n[3] Testing updateSettings() to modify configuration in PostgreSQL...");
  const updatedAgencyName = "LaunchCraft Global Advisory";
  const updatedPhone = "+44 (0) 20 8888 9999";
  const updatedSettings = await updateSettings({
    ...settings,
    agencyName: updatedAgencyName,
    phone: updatedPhone,
  });

  if (updatedSettings.agencyName !== updatedAgencyName) {
    throw new Error("updateSettings returned unexpected agencyName!");
  }
  console.log(`✓ updateSettings returned updated agency name: ${updatedSettings.agencyName}`);

  // Direct PostgreSQL DB Verification of updated values
  console.log("\n[4] Verifying updated values directly in PostgreSQL...");
  const dbAfterUpdate = await prisma.setting.findUnique({
    where: { key: "site_settings" },
  });
  const updatedDbVal = dbAfterUpdate?.value as any;
  if (!updatedDbVal || updatedDbVal.agencyName !== updatedAgencyName || updatedDbVal.phone !== updatedPhone) {
    throw new Error("Database verification of updated settings failed!");
  }
  console.log(`✓ Verified in PostgreSQL: Agency="${updatedDbVal.agencyName}", Phone="${updatedDbVal.phone}"`);

  // PART 3: RESTORE CLEAN DEFAULT SETTINGS
  console.log("\n[5] Restoring default agency name and phone...");
  await updateSettings({
    ...settings,
    agencyName: "LaunchCraft",
    phone: "+44 (0) 20 7946 0192",
  });
  console.log("✓ Default settings restored.");

  console.log("\n==================================================================");
  console.log("   ALL MODEL SETTING (SITE SETTINGS) TESTS PASSED 100%!           ");
  console.log("==================================================================");

  await prisma.$disconnect();
}

runSettingsValidation().catch((err) => {
  console.error("FATAL SETTINGS VALIDATION ERROR:", err);
  process.exit(1);
});

