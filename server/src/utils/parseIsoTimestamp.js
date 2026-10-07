const parseIsoTimestamp = (value) => {
   if (typeof value !== 'string') return null;

   const parsed = new Date(value);
   if (!Number.isFinite(parsed.getTime()) || parsed.toISOString() !== value) {
      return null;
   }

   return parsed;
};

module.exports = parseIsoTimestamp;