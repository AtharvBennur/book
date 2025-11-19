import SectionHeading from '../components/common/SectionHeading';
import ReadingGoal from '../components/insights/ReadingGoal';
import ActivityTimeline from '../components/insights/ActivityTimeline';
import CollectionsSpotlight from '../components/insights/CollectionsSpotlight';
import SwapBadges from '../components/insights/SwapBadges';
import { useAppData } from '../context/AppDataContext';

const Insights = () => {
  const { books, exchanges } = useAppData();
  const completedSwaps = exchanges.filter((ex) => ex.status === 'accepted').length;

  return (
    <div className="space-y-10">
      <SectionHeading
        eyebrow="Insights"
        title="Understand your swapping habits"
        description="Track goals, monitor exchange activity, and discover curated community events."
        align="left"
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ReadingGoal completed={completedSwaps} />
        <CollectionsSpotlight books={books} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ActivityTimeline exchanges={exchanges} />
        <SwapBadges completed={completedSwaps} />
      </div>
    </div>
  );
};

export default Insights;

