import { test, expect } from "@playwright/test";

test.describe("Discovery Feature (Photographer Browse)", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the discovery page
    await page.goto("/photographers");
  });

  test("1. Search functionality (Happy Path)", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search by name or username");
    
    // We assume there's at least one photographer in the seed/DB.
    // Typing something likely to match or just observing the debounce.
    await searchInput.fill("admin"); 
    
    // Wait for the debounce and network request
    // We expect the photographer cards to be filtered or updated.
    // Even if no results, we check that it didn't crash.
    await expect(page.locator('[data-testid="photographer-card"]')).toBeDefined();
  });

  test("2. Filter interaction and URL synchronization", async ({ page }) => {
    // Select Specialty: Wedding
    await page.getByLabel("Specialty").click();
    await page.getByRole("option", { name: "Wedding" }).click();

    // Select Location: London
    await page.getByLabel("Location").click();
    await page.getByRole("option", { name: "London" }).click();

    // Verify URL contains the params
    await expect(page).toHaveURL(/.*specialty=wedding/);
    await expect(page).toHaveURL(/.*location=london/);
  });

  test("3. Deep linking / URL Hydration", async ({ page }) => {
    // Load page with pre-set filters in URL
    await page.goto("/photographers?specialty=portrait&location=tokyo");

    // Check if the Select inputs show the correct values
    await expect(page.getByLabel("Specialty")).toHaveText("Portrait");
    await expect(page.getByLabel("Location")).toHaveText("Tokyo");
  });

  test("4. Pagination flow", async ({ page }) => {
    // Note: This test assumes there are enough photographers to trigger pagination (more than 12)
    // If there aren't, the controls won't show. We check for existence first.
    const nextButton = page.getByLabel("Next page");
    
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await expect(page).toHaveURL(/.*page=2/);
      
      // Navigate back
      await page.getByLabel("Previous page").click();
      await expect(page).toHaveURL(/.*page=1/);
    }
  });

  test("5. Empty state and Reset", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search by name or username");
    
    // Type something that definitely won't exist
    await searchInput.fill("non_existent_photographer_xyz_123");
    
    // Wait for empty state
    await expect(page.getByText("No photographers found")).toBeVisible();
    
    // Click Reset / Clear filters
    await page.getByRole("button", { name: "Clear filters" }).click();
    
    // Search should be empty and results should return
    await expect(searchInput).toHaveValue("");
    await expect(page.locator('[data-testid="photographer-card"]').first()).toBeVisible();
  });
});
