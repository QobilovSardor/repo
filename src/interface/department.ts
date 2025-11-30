export interface IDepartment {
  id: number;
  depType: string;
  nameUz: string;
  nameEn: string | null;
  nameRu: string | null;
  isBlocked: boolean;
}
