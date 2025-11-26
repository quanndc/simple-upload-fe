export interface User {
  id: string;
  created_at?: string;
  name: string;
  email: string;
  firebaseUid: string;
  picture?: string;
}

export interface Comment {
  id: string | number;
  body: string;
  createdAt: string | Date;
  updatedAt?: Date;
  photoId: string | number;
  userId?: string;
  user_firebase_id?: string;
  User?: User;
}