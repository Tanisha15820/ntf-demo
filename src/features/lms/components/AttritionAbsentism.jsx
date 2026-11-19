import LMSAttrition from "./LMSAttrition";
import LMSAbsentism from "./LMSAbsentism";

const AttritionAbsentism = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Card 1 */}
      <LMSAttrition />

      {/* Card 2 */}
      <LMSAbsentism />
    </div>
  );
};

export default AttritionAbsentism;
