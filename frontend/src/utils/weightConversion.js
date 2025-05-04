/**
 * Utility functions for weight conversion between kilograms and pounds
 */

// Conversion factor: 1 kg = 2.20462 lbs
const KG_TO_LBS_FACTOR = 2.20462;

/**
 * Convert kilograms to pounds
 * @param {number} kg - Weight in kilograms
 * @returns {number} Weight in pounds, rounded to 1 decimal place
 */
export const kgToLbs = (kg) => {
  return Math.round((kg * KG_TO_LBS_FACTOR) * 10) / 10;
};

/**
 * Convert pounds to kilograms
 * @param {number} lbs - Weight in pounds
 * @returns {number} Weight in kilograms, rounded to 1 decimal place
 */
export const lbsToKg = (lbs) => {
  return Math.round((lbs / KG_TO_LBS_FACTOR) * 10) / 10;
};
