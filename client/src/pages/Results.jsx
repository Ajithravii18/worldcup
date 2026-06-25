import { EmptyState } from "../components/EmptyState";
import { ErrorBanner } from "../components/ErrorBanner";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { MatchCard } from "../components/MatchCard";
import { SectionHeader } from "../components/SectionHeader";
import { getResults } from "../services/api";
import { useApiResource } from "../hooks/useApiResource";
import { mockResults } from "../utils/mockData";

export function ResultsPage() {
  const { data: results, isLoading, error } = useApiResource(getResults, mockResults);

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-bold text-app-primary">Final scores</p>
        <h1 className="text-3xl font-black text-app-ink">Results</h1>
      </header>

      {error ? <ErrorBanner message="Using sample completed matches." /> : null}

      {isLoading ?
      <LoadingSkeleton rows={5} /> :
      results.length ?
      <div className="space-y-7">
          {results.map((group) =>
        <section key={group.label}>
              <SectionHeader title={group.label} />
              <div className="space-y-3">
                {group.matches.map((match, index) =>
            <MatchCard key={match.id} match={match} compact index={index} />
            )}
              </div>
            </section>
        )}
        </div> :

      <EmptyState
        title="No results yet"
        description="Completed World Cup matches will be grouped by date here." />

      }
    </div>);

}