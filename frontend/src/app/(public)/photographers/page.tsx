import { Page } from "@/components/Page";
import { DiscoverySearchInput, DiscoveryFilters, DiscoveryResults } from "@/features/discovery/Discovery";

export default function PhotographersRoutePage() {
  return (
    <Page>
      <Page.Header>
        <Page.Stack className="gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">Discovery</p>
          <Page.Title>Find photographers</Page.Title>
          <Page.Description>
            Browse by category, location, and budget. Open profiles to view full portfolio and contact details.
          </Page.Description>
        </Page.Stack>

        <div className="mt-4">
          <DiscoverySearchInput />
        </div>
      </Page.Header>

      <Page.Body>
        <Page.Aside>
          <DiscoveryFilters />
        </Page.Aside>

        <Page.Section>
          <DiscoveryResults />
        </Page.Section>
      </Page.Body>
    </Page>
  );
}
