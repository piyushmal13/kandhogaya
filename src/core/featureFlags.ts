let FLAGS: Record<string, boolean> = {};

export const setFlags = (data: { key: string; enabled: boolean }[]) => {
  FLAGS = data.reduce((acc, item) => {
    acc[item.key] = item.enabled;
    return acc;
  }, {} as Record<string, boolean>);
};

export const getFlag = (key: string): boolean => {
  return FLAGS[key] ?? false;
};
