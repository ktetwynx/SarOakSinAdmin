export const BEARER_TOKEN = "BEARER_TOKEN";
export const PROFILE = "PROFILE";

export interface Profile {
  id: 0;
  username: "";
  email: "";
}

export function setToken(token: any) {
  return { type: BEARER_TOKEN, token };
}

export function setProfile(profile?: Profile) {
  return { type: PROFILE, profile };
}
