import type { Specification } from "@/lib/types";

type Props = {
  specGroups: Record<string, Specification[] | undefined>;
};

export default function ProductSpecifications({ specGroups }: Props) {
  return (
    <div className="space-y-8">
      {Object.entries(specGroups).map(([group, specs]) => (
        <div key={group}>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">{group}</h3>
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="w-full">
              <tbody>
                {specs?.map((spec, index) => (
                  <tr
                    key={spec.id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 w-1/3 border-r border-gray-200">
                      {spec.label}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {spec.value}
                      {spec.unit && (
                        <span className="text-gray-500 ml-1">{spec.unit}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
