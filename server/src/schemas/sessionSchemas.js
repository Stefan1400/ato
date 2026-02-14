const { z } = require('zod');

const addSessionSchema = z.object({
  session_started: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "session_started must be a valid timestamp",
  }),
  session_ended: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "session_ended must be a valid timestamp",
  }),
});

module.exports = {
   addSessionSchema,
};