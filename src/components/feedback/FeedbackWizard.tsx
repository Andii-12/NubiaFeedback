"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NubiaLogo } from "@/components/nubia/NubiaLogo";
import { ProgressStepper } from "@/components/nubia/ProgressStepper";
import { QuestionCard } from "@/components/nubia/QuestionCard";
import { ChoiceChip } from "@/components/nubia/ChoiceChip";
import { DeviceSelector } from "@/components/nubia/DeviceSelector";
import { LocationSelector } from "@/components/nubia/LocationSelector";
import { EngineerRating } from "@/components/nubia/EngineerRating";
import { CommentBox } from "@/components/nubia/CommentBox";
import { FormNavigation } from "@/components/nubia/FormNavigation";
import { FeedbackSummary } from "@/components/nubia/FeedbackSummary";
import {
  useCatalog,
  useFeedbackForm,
} from "@/components/feedback/FeedbackFormProvider";
import {
  COMMUNICATION,
  DEVICE_STATUS,
  EXPLANATION_QUALITY,
  FULLY_RESOLVED,
  IMPACT_LEVELS,
  RESOLUTION_SPEED,
  RESPONSE_SPEED,
  TONE_CLASSES,
} from "@/lib/constants";
import { DateSelector } from "@/components/nubia/DateSelector";
import {
  answerFor,
  detailOptions,
  detailQuestion,
  deviceLabel,
  missingDeviceAnswer,
  orderedDevices,
  pruneAnswers,
  upsertAnswer,
} from "@/lib/device-answers";
import { isCompleteDate } from "@/lib/date-parts";
import { CheckCircle2, CircleAlert, CircleMinus, Clock3, WifiOff } from "lucide-react";
import { localTime, shiftFromHour } from "@/lib/utils";

const STATUS_ICONS = {
  normal: <CheckCircle2 className="size-5 text-emerald-600" />,
  slow: <Clock3 className="size-5 text-amber-500" />,
  intermittent: <CircleMinus className="size-5 text-orange-500" />,
  down: <CircleAlert className="size-5 text-red-500" />,
  disconnected: <WifiOff className="size-5 text-slate-500" />,
};

export function FeedbackWizard() {
  const router = useRouter();
  const { form, update, setForm, reset } = useFeedbackForm();
  const { airlines, locations, loading } = useCatalog();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const displayStep = Math.min(step, 4);

  function validateStep(current: number) {
    if (current === 1) {
      if (!form.airlineId) return "Airline сонгоно уу.";
      if (form.locationTypes.length !== 1) return "Байршлын төрөл сонгоно уу.";
      const selected = locations.filter((item) =>
        form.locationIds.includes(item._id)
      );
      if (selected.length !== 1 || selected[0]?.type !== form.locationTypes[0]) {
        return form.locationTypes[0] === "checkin"
          ? "Check-in ширээ сонгоно уу."
          : "Gate сонгоно уу.";
      }
      if (!isCompleteDate(form.date)) return "Он, сар, өдөр сонгоно уу.";
    }
    if (current === 2) {
      if (!form.devices.length) return "Төхөөрөмж сонгоно уу.";
      const deviceMessage = missingDeviceAnswer(form.devices, form.deviceAnswers);
      if (deviceMessage) return deviceMessage;
      if (!form.impactLevel) return "Нөлөөллийн түвшинг сонгоно уу.";
    }
    if (current === 3) {
      if (!form.responseSpeed) return "Хариу өгөх хурдыг сонгоно уу.";
      if (!form.resolutionSpeed) return "Шийдвэрлэлтийг сонгоно уу.";
      if (!form.fullyResolved) return "Шийдэгдсэн эсэхийг сонгоно уу.";
      if (!form.communication) return "Харилцааны үнэлгээг сонгоно уу.";
      if (!form.explanationQuality) return "Тайлбарын үнэлгээг сонгоно уу.";
      if (!form.engineerRating) return "Инженерийн үнэлгээг сонгоно уу.";
    }
    return "";
  }

  function next() {
    const message = validateStep(step);
    if (message) {
      setError(message);
      toast.error(message);
      return;
    }
    setError("");
    setStep((s) => Math.min(5, s + 1));
  }

  async function submit() {
    const message = validateStep(1) || validateStep(2) || validateStep(3);
    if (message) {
      toast.error(message);
      return;
    }
    setSubmitting(true);
    const now = new Date();
    const stamped = {
      ...form,
      time: localTime(now),
      shift: shiftFromHour(now.getHours()),
    };
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stamped),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Илгээхэд алдаа гарлаа.");
      }
      reset();
      const params = new URLSearchParams({
        id: data.requestId,
        airline: data.airlineName || "",
        location: data.locationName || "",
        date: stamped.date,
      });
      router.push(`/feedback/success?${params.toString()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Илгээхэд алдаа гарлаа.");
    } finally {
      setSubmitting(false);
    }
  }

  const title = useMemo(() => {
    if (step === 1) return "Үндсэн мэдээлэл";
    if (step === 2) return "Техникийн асуултууд";
    if (step === 3) return "Инженерийн үйлчилгээний үнэлгээ";
    if (step === 4) return "Нэмэлт сэтгэгдэл";
    return "Хяналт";
  }, [step]);

  const subtitle = useMemo(() => {
    if (step === 1) return "Таны санал, техникийн мэдээлэл бидэнд маш чухал. 1 минутын дотор бөглөнө үү.";
    if (step === 2) return "Сонголтоо хийгээд үргэлжлүүлнэ үү.";
    if (step === 3) return "Доорх асуултуудад сонголтоор хариулна уу.";
    if (step === 4) return "Хэрэв хүсвэл нэмэлт санал, хүсэлт, тайлбараа бичнэ үү.";
    return "Илгээхээсээ өмнө мэдээллээ шалгана уу.";
  }, [step]);

  return (
    <div className="mx-auto w-full max-w-lg pb-28 md:pb-8">
      <header className="mb-5 flex items-center justify-between">
        <NubiaLogo />
        <span className="rounded-full bg-nubia-light px-3 py-1 text-xs font-medium text-primary">
          NUBIA AIS
        </span>
      </header>
      <ProgressStepper step={displayStep} />
      <div className="mt-5">
        {step === 1 ? (
          <>
            <h1 className="text-[28px] font-semibold leading-tight text-navy">
              Сайн байна уу 👋
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {subtitle}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-navy">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </>
        )}
      </div>

      {error ? (
        <div className="mt-4 rounded-[14px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2 }}
          className="mt-5 space-y-4"
        >
          {step === 1 && (
            <>
              <QuestionCard title="Airline">
                <select
                  className="h-12 w-full rounded-[14px] border-2 border-border bg-white px-3 text-base outline-none focus:border-primary"
                  value={form.airlineId}
                  onChange={(e) => update("airlineId", e.target.value)}
                  disabled={loading}
                >
                  <option value="">Airline сонгоно уу</option>
                  {airlines.map((airline) => (
                    <option key={airline._id} value={airline._id}>
                      {airline.name}
                    </option>
                  ))}
                </select>
              </QuestionCard>
              <QuestionCard title="Байршлын төрөл">
                <LocationSelector
                  locationTypes={form.locationTypes}
                  locationIds={form.locationIds}
                  locations={locations}
                  onChange={({ locationTypes, locationIds }) =>
                    setForm((prev) => {
                      const devices = locationTypes.includes("gate")
                        ? prev.devices
                        : prev.devices.filter((device) => device !== "BGR");
                      return {
                        ...prev,
                        locationTypes,
                        locationIds,
                        devices,
                        deviceAnswers: pruneAnswers(devices, prev.deviceAnswers),
                      };
                    })
                  }
                />
              </QuestionCard>
              <QuestionCard
                title="Огноо"
                subtitle="Асуудал гарсан он, сар, өдрийг сонгоно уу."
              >
                <DateSelector
                  value={form.date}
                  onChange={(date) => update("date", date)}
                />
              </QuestionCard>
            </>
          )}

          {step === 2 && (
            <>
              <QuestionCard title="Ямар төхөөрөмж дээр асуудал гарсан бэ?">
                <DeviceSelector
                  value={form.devices}
                  showBgr={form.locationTypes.includes("gate")}
                  onChange={(devices) =>
                    setForm((prev) => ({
                      ...prev,
                      devices,
                      deviceAnswers: pruneAnswers(devices, prev.deviceAnswers),
                    }))
                  }
                />
              </QuestionCard>
              {orderedDevices(form.devices).map((device) => {
                const answer = answerFor(form.deviceAnswers, device);
                const details = detailOptions(device);
                return (
                  <div key={device} className="space-y-4">
                    <QuestionCard title={`${deviceLabel(device)} ажиллагаа ямар байсан бэ?`}>
                      <div className="space-y-2">
                        {DEVICE_STATUS.map((item) => (
                          <ChoiceChip
                            key={item.value}
                            selected={answer.status === item.value}
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                deviceAnswers: upsertAnswer(
                                  prev.deviceAnswers,
                                  device,
                                  { status: item.value }
                                ),
                              }))
                            }
                            icon={STATUS_ICONS[item.value]}
                            tone={
                              answer.status === item.value
                                ? TONE_CLASSES[item.tone]
                                : ""
                            }
                          >
                            {item.label}
                          </ChoiceChip>
                        ))}
                      </div>
                    </QuestionCard>
                    {details.length ? (
                      <QuestionCard title={detailQuestion(device)}>
                        <div className="space-y-2">
                          {details.map((item) => (
                            <ChoiceChip
                              key={item.value}
                              selected={answer.detail === item.value}
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  deviceAnswers: upsertAnswer(
                                    prev.deviceAnswers,
                                    device,
                                    { detail: item.value }
                                  ),
                                }))
                              }
                            >
                              {item.label}
                            </ChoiceChip>
                          ))}
                        </div>
                      </QuestionCard>
                    ) : null}
                  </div>
                );
              })}
              <QuestionCard title="Асуудал ажлын үйл ажиллагаанд хэр нөлөөлсөн бэ?">
                <div className="space-y-2">
                  {IMPACT_LEVELS.map((item) => (
                    <ChoiceChip
                      key={item.value}
                      selected={form.impactLevel === item.value}
                      onClick={() => update("impactLevel", item.value)}
                    >
                      <span className="flex w-full items-center justify-between gap-2">
                        <span>{item.label}</span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] ${TONE_CLASSES[item.severity]}`}
                        >
                          {item.severity}
                        </span>
                      </span>
                    </ChoiceChip>
                  ))}
                </div>
              </QuestionCard>
            </>
          )}

          {step === 3 && (
            <>
              <QuestionCard title="Инженер дуудлагад хэр хурдан хариу өгсөн бэ?">
                <div className="space-y-2">
                  {RESPONSE_SPEED.map((item) => (
                    <ChoiceChip
                      key={item.value}
                      selected={form.responseSpeed === item.value}
                      onClick={() => update("responseSpeed", item.value)}
                    >
                      {item.label}
                    </ChoiceChip>
                  ))}
                </div>
              </QuestionCard>
              <QuestionCard title="Инженер асуудлыг хурдан шийдвэрлэж чадсан уу?">
                <div className="grid grid-cols-3 gap-2">
                  {RESOLUTION_SPEED.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => update("resolutionSpeed", item.value)}
                      className={`h-14 rounded-[14px] border-2 text-sm font-semibold ${
                        form.resolutionSpeed === item.value
                          ? "border-primary bg-nubia-light"
                          : "border-border bg-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </QuestionCard>
              <QuestionCard title="Асуудал бүрэн шийдэгдсэн үү?">
                <div className="grid grid-cols-3 gap-2">
                  {FULLY_RESOLVED.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => update("fullyResolved", item.value)}
                      className={`h-14 rounded-[14px] border-2 text-sm font-semibold ${
                        form.fullyResolved === item.value
                          ? "border-primary bg-nubia-light"
                          : "border-border bg-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </QuestionCard>
              <QuestionCard title="Инженерийн харилцаа, хандлага ямар байсан бэ?">
                <div className="grid grid-cols-2 gap-2">
                  {COMMUNICATION.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => update("communication", item.value)}
                      className={`flex min-h-[84px] flex-col items-center justify-center rounded-[16px] border-2 ${
                        form.communication === item.value
                          ? "border-primary bg-nubia-light"
                          : "border-border bg-white"
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="mt-1 text-sm font-semibold">{item.label}</span>
                    </button>
                  ))}
                </div>
              </QuestionCard>
              <QuestionCard title="Инженерийн тайлбар ойлгомжтой байсан уу?">
                <div className="space-y-2">
                  {EXPLANATION_QUALITY.map((item) => (
                    <ChoiceChip
                      key={item.value}
                      selected={form.explanationQuality === item.value}
                      onClick={() => update("explanationQuality", item.value)}
                    >
                      {item.label}
                    </ChoiceChip>
                  ))}
                </div>
              </QuestionCard>
              <QuestionCard title="Инженерийн үйлчилгээний ерөнхий үнэлгээ">
                <EngineerRating
                  value={form.engineerRating}
                  onChange={(v) => update("engineerRating", v)}
                />
              </QuestionCard>
            </>
          )}

          {step === 4 && (
            <QuestionCard
              title="Нэмэлт сэтгэгдэл"
              subtitle="Энэ талбар заавал биш."
            >
              <CommentBox
                value={form.comment}
                onChange={(v) => update("comment", v)}
              />
            </QuestionCard>
          )}

          {step === 5 && (
            <FeedbackSummary
              form={form}
              airlines={airlines}
              locations={locations}
              onEdit={setStep}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <FormNavigation
        showBack={step > 1}
        onBack={() => {
          setError("");
          setStep((s) => Math.max(1, s - 1));
        }}
        onNext={step === 5 ? submit : next}
        nextLabel={step === 5 ? "Илгээх" : step === 4 ? "Хянах →" : "Үргэлжлүүлэх →"}
        loading={submitting}
      />
    </div>
  );
}
