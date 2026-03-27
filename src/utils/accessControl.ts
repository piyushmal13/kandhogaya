export const getAccess = (userProfile: any) => {
  if (!userProfile) {
    return {
      signals: false,
      algo: false,
      academy: false,
      admin: false
    };
  }

  if (userProfile.role === "admin") {
    return {
      signals: true,
      algo: true,
      academy: true,
      admin: true
    };
  }

  return {
    signals: userProfile.isPro ?? false,
    algo: userProfile.isPro ?? false,
    academy: userProfile.isPro ?? false,
    admin: false
  };
};
