const normalizeName = (string) => {
  return string.replaceAll("_", " ").replace(/^./, string[0].toUpperCase());
};

export const getDiseases = ({ key, records }) => {
  const diseases = records.map((row) => {
    const item = row.get(key);

    return normalizeName(item.properties.name);
  });

  return diseases;
};
