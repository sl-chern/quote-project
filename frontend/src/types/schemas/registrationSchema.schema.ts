import { z } from 'zod';

const registrationSchema = z.object({
  username: z
    .string()
    .min(3, 'User name must be at least 8 characters')
    .max(24, 'User name can be a total of 24 characters'),
  email: z.string().email('Incorrect format of email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(24, 'Password can be a total of 24 characters')
    .regex(
      /^[a-zA-Z\d!"#$%&'()*+,-.\/:;<=>?@\[\\\]^_\`{|}~]+$/g,
      'Password can only contain Latin letters and special characters',
    )
    .refine(value => {
      const specialChars = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
      for (const char of specialChars) {
        if (value?.includes(char)) return true;
      }
      return false;
    }, 'Password must contain at least one special character'),
});

export default registrationSchema;
