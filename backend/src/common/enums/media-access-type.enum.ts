export const MediaAccessType = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
} as const;

export type MediaAccessType = (typeof MediaAccessType)[keyof typeof MediaAccessType];
