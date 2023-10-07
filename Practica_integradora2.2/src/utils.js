import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getValidFilters = (filters, documentType) => {
  const cleanFilter = {};
  //Aquí es muy importante que yo tenga ya un diccionario de filtros
  switch (documentType) {
    case "product": {
      if (filters.category) {
        if (typeof categories === "string") {
          cleanFilter["category"] = { $in: [filters.category] };
        } else {
          cleanFilter["category"] = { $in: filters.category };
        }
      }
      if (filters.gte) {
        cleanFilter["price"] = { $gte: filters.gte };
      }
      if (filters.price) {
        cleanFilter["price"] = filters.price;
      }
      return cleanFilter;
    }
  }
};
export default __dirname;
