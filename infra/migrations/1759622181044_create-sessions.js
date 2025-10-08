exports.up = (pgm) => {
  pgm.createTable("sessions", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    token: {
      type: "VARCHAR(96)",
      notNull: true,
      unique: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
    },
    created_at: {
      type: "TIMESTAMPTZ",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
    expires_at: {
      type: "TIMESTAMPTZ",
      notNull: true,
    },
    updated_at: {
      type: "TIMESTAMPTZ",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};
exports.down = false;
