export function validateUserExists(user: any): asserts user {
    if (!user) throw new Error('User not found');
  }
  