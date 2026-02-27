import { Schema, models, model} from "mongoose";

const RefreshTokenSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User" ,// same name as your user model exports,
            required: true,
            index: true,
        },

        // Store hash of Refresh tokens ( Never store raw token in database )
        tokenHash: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        // detect resuse pr Revoke
        revokedAt: { type: Date, default: null},

        //device/ seccions metadata
        userAgent: { type: String, default: ""},
        ip: {type: String, default: ""},

        // Expiry for automatic cleanup
        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
    },

    { timestamps: true }
);

// TTL index : Mongo will aut delete after expiresAt
RefreshTokenSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});
const RefreshToken = models.RefreshToken || model("RefreshToken", RefreshTokenSchema);


export default RefreshToken;
