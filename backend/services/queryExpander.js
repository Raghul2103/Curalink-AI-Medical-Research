export const expandQuery = (userQuery, disease) => {
  if (!disease) return userQuery;
  if (userQuery.toLowerCase().includes(disease.toLowerCase())) return userQuery;
  return `${userQuery} ${disease}`;
};
