import { z } from "zod";

export const feedbackSchema = z.object({
  airlineId: z.string().min(1, "Airline сонгоно уу."),
  locationTypes: z
    .array(z.enum(["checkin", "gate"]))
    .min(1, "Байршлын төрөл сонгоно уу."),
  locationIds: z.array(z.string().min(1)).min(1, "Байршлаа сонгоно уу."),
  date: z.string().min(1, "Огноо сонгоно уу."),
  shift: z.enum(["morning", "afternoon", "evening"], {
    message: "Ээлж сонгоно уу.",
  }),
  time: z.string().min(1),
  devices: z.array(z.string()).min(1, "Төхөөрөмж сонгоно уу."),
  deviceAnswers: z
    .array(
      z.object({
        device: z.string().min(1),
        status: z.string().min(1),
        detail: z.string().optional().default(""),
      })
    )
    .default([]),
  deviceStatus: z.string().optional().default(""),
  printingStatus: z.string().optional().default(""),
  scanningStatus: z.string().optional().default(""),
  workstationStatus: z.string().optional().default(""),
  impactLevel: z.string().min(1, "Нөлөөллийн түвшинг сонгоно уу."),
  responseSpeed: z.string().min(1, "Хариу өгөх хурдыг сонгоно уу."),
  resolutionSpeed: z.enum(["yes", "no"], {
    message: "Шийдвэрлэлтийг сонгоно уу.",
  }),
  resolutionNote: z.string().max(500, "500 тэмдэгтээс хэтрэхгүй.").default(""),
  fullyResolved: z.enum(["yes", "no"], {
    message: "Шийдэгдсэн эсэхийг сонгоно уу.",
  }),
  resolvedNote: z.string().max(500, "500 тэмдэгтээс хэтрэхгүй.").default(""),
  communication: z.string().min(1, "Харилцааны үнэлгээг сонгоно уу."),
  communicationNote: z.string().max(500, "500 тэмдэгтээс хэтрэхгүй.").default(""),
  explanationQuality: z.string().min(1, "Тайлбарын үнэлгээг сонгоно уу."),
  engineerRating: z
    .number()
    .min(1, "Инженерийн үнэлгээг сонгоно уу.")
    .max(5),
  comment: z.string().max(500, "Сэтгэгдэл 500 тэмдэгтээс хэтрэхгүй.").optional(),
});

export const airlineSchema = z.object({
  name: z.string().min(1, "Нэр оруулна уу."),
  code: z.string().min(1, "Код оруулна уу."),
  logo: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const locationSchema = z.object({
  name: z.string().min(1, "Нэр оруулна уу."),
  code: z.string().min(1, "Код оруулна уу."),
  type: z.enum(["checkin", "gate"]),
  isActive: z.boolean().optional(),
  qrIdentifier: z.string().optional(),
});

export const engineerSchema = z.object({
  name: z.string().min(1, "Нэр оруулна уу."),
  email: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("И-мэйл буруу байна."),
  password: z.string().min(1, "Нууц үг оруулна уу."),
});
