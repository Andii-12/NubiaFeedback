"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NubiaLogo } from "@/components/nubia/NubiaLogo";
import { ProgressStepper } from "@/components/nubia/ProgressStepper";
import { QuestionCard } from "@/components/nubia/QuestionCard";
import { DeviceSelector } from "@/components/nubia/DeviceSelector";
import { LocationSelector } from "@/components/nubia/LocationSelector";
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
  RESPONSE_SPEED,
  TONE_CLASSES,
} from "@/lib/constants";
import { DateSelector } from "@/components/nubia/DateSelector";
import { TimeSelector } from "@/components/nubia/TimeSelector";
import {
  answerFor,
  detailOptions,
  detailQuestion,
  deviceDetailKind,
  deviceLabel,
  missingDeviceAnswer,
  orderedDevices,
  pruneAnswers,
  upsertAnswer,
} from "@/lib/device-answers";
import { isCompleteDate, isOnOrBeforeToday } from "@/lib/date-parts";
import { hourFromRange, shiftFromHour } from "@/lib/utils";
import { LanguageSwitch, useI18n } from "@/components/i18n/LocaleProvider";
import { optionLabel } from "@/lib/i18n/options";

function communicationKind(value: string) {
  if (value === "excellent" || value === "good") return "praise";
  if (value === "average" || value === "poor") return "explain";
  return "";
}

function communicationPrompt(
  value: string,
  praise: string,
  explain: string
) {
  if (communicationKind(value) === "praise") return praise;
  if (communicationKind(value) === "explain") return explain;
  return "";
}

function YesNoChoice({
  value,
  note,
  onChoose,
  onNote,
}: {
  value: string;
  note: string;
  onChoose: (next: "yes" | "no") => void;
  onNote: (next: string) => void;
}) {
  const { t } = useI18n();
  const prompt =
    value === "yes" ? t.form.thanks : value === "no" ? t.form.why : "";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {[
          { value: "yes" as const, label: t.common.yes },
          { value: "no" as const, label: t.common.no },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onChoose(item.value)}
            className={`h-10 rounded-xl border text-sm font-semibold ${
              value === item.value
                ? "border-primary bg-nubia-light"
                : "border-border bg-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {prompt ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {prompt} <span>{t.common.optional}</span>
          </p>
          <textarea
            value={note}
            onChange={(event) => onNote(event.target.value.slice(0, 500))}
            rows={2}
            placeholder={t.common.writeHere}
            className="w-full rounded-xl border border-border bg-white p-2.5 text-sm text-navy outline-none placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
      ) : null}
    </div>
  );
}

function pillClass(selected: boolean) {
  return `h-8 rounded-full border px-3 text-xs font-medium ${
    selected
      ? "border-primary bg-nubia-light text-navy"
      : "border-border bg-white text-navy"
  }`;
}

export function FeedbackWizard() {
  const router = useRouter();
  const { form, update, setForm, reset } = useFeedbackForm();
  const { locale, t } = useI18n();
  const { airlines, locations, loading } = useCatalog();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const displayStep = Math.min(step, 4);

  function validateStep(current: number) {
    if (current === 1) {
      if (!form.airlineId) return t.form.errAirline;
      if (form.locationTypes.length !== 1) return t.form.errType;
      const selected = locations.filter((item) =>
        form.locationIds.includes(item._id)
      );
      if (selected.length !== 1 || selected[0]?.type !== form.locationTypes[0]) {
        return form.locationTypes[0] === "checkin"
          ? t.form.errCheckin
          : t.form.errGate;
      }
      if (!isCompleteDate(form.date)) return t.form.errDate;
      if (!isOnOrBeforeToday(form.date)) return t.form.errFuture;
      if (hourFromRange(form.time) == null) return t.form.errTime;
    }
    if (current === 2) {
      if (!form.devices.length) return t.form.errDevice;
      const deviceMessage = missingDeviceAnswer(
        form.devices,
        form.deviceAnswers,
        locale
      );
      if (deviceMessage) return deviceMessage;
    }
    if (current === 3) {
      if (!form.responseSpeed) return t.form.errSpeed;
      if (form.resolutionSpeed !== "yes" && form.resolutionSpeed !== "no") {
        return t.form.errResolution;
      }
      if (!form.communication) return t.form.errTalk;
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
    const start = hourFromRange(form.time);
    const stamped = {
      ...form,
      shift: start == null ? form.shift : shiftFromHour(start),
    };
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stamped),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.form.errSend);
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
      toast.error(err instanceof Error ? err.message : t.form.errSend);
    } finally {
      setSubmitting(false);
    }
  }

  const title = useMemo(() => {
    if (step === 1) return t.form.basic;
    if (step === 2) return t.form.technical;
    if (step === 3) return t.form.engineer;
    if (step === 4) return t.form.comment;
    return t.form.check;
  }, [step, t]);

  const subtitle = useMemo(() => {
    if (step === 1) return t.form.basicSub;
    if (step === 4) return t.form.commentSub;
    if (step === 5) return t.form.checkSub;
    return "";
  }, [step, t]);

  return (
    <div className="mx-auto w-full max-w-lg pb-28 md:pb-8">
      <header className="mb-3 flex items-center justify-between">
        <NubiaLogo />
        <LanguageSwitch />
      </header>
      <ProgressStepper step={displayStep} />
      <div className="mt-3">
        {step === 1 ? (
          <>
            <h1 className="text-xl font-semibold leading-tight text-navy">
              {t.form.hello}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-navy">{title}</h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
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
          className="mt-3 space-y-3"
        >
          {step === 1 && (
            <>
              <QuestionCard title={t.form.airline}>
                <select
                  className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-primary"
                  value={form.airlineId}
                  onChange={(e) => update("airlineId", e.target.value)}
                  disabled={loading}
                >
                  <option value="">{t.form.airlinePh}</option>
                  {airlines.map((airline) => (
                    <option key={airline._id} value={airline._id}>
                      {airline.name}
                    </option>
                  ))}
                </select>
              </QuestionCard>
              <QuestionCard title={t.form.locationType}>
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
                title={t.form.date}
                subtitle={t.form.dateHint}
              >
                <DateSelector
                  value={form.date}
                  onChange={(date) => update("date", date)}
                />
              </QuestionCard>
              <QuestionCard title={t.form.time} subtitle={t.form.timeHint}>
                <TimeSelector
                  value={form.time}
                  onChange={(time) => {
                    const start = hourFromRange(time);
                    setForm((prev) => ({
                      ...prev,
                      time,
                      shift: start == null ? prev.shift : shiftFromHour(start),
                    }));
                  }}
                />
              </QuestionCard>
            </>
          )}

          {step === 2 && (
            <>
              <QuestionCard title={t.form.whichDevice}>
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
                  <QuestionCard key={device} title={deviceLabel(device, locale)}>
                    <div className="grid grid-cols-2 gap-1.5">
                      {DEVICE_STATUS.filter((item) => item.value !== "slow").map(
                        (item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                deviceAnswers: upsertAnswer(
                                  prev.deviceAnswers,
                                  device,
                                  {
                                    status: item.value,
                                    ...(item.value === "normal" ? { detail: "" } : {}),
                                  }
                                ),
                              }))
                            }
                            className={`h-9 rounded-lg border text-xs font-semibold ${
                              answer.status === item.value
                                ? TONE_CLASSES[item.tone]
                                : "border-border bg-white text-navy"
                            }`}
                          >
                            {optionLabel(
                              locale,
                              "status",
                              item.value === "down" &&
                                (device === "Mouse" || device === "Monitor")
                                ? "wasDown"
                                : item.value
                            )}
                          </button>
                        )
                      )}
                    </div>
                    {answer.status === "down" && details.length ? (
                      <div className="mt-3 space-y-1.5">
                        <p className="text-xs text-muted-foreground">
                          {detailQuestion(device, locale)}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {details.map((item) => (
                            <button
                              key={item.value}
                              type="button"
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
                              className={pillClass(answer.detail === item.value)}
                            >
                              {optionLabel(
                                locale,
                                deviceDetailKind(device) === "print"
                                  ? "print"
                                  : deviceDetailKind(device) === "scan"
                                    ? "scan"
                                    : "work",
                                item.value
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </QuestionCard>
                );
              })}
            </>
          )}

          {step === 3 && (
            <>
              <QuestionCard title={t.form.speed}>
                <div className="flex flex-wrap gap-1.5">
                  {RESPONSE_SPEED.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => update("responseSpeed", item.value)}
                      className={pillClass(form.responseSpeed === item.value)}
                    >
                      {optionLabel(locale, "speed", item.value)}
                    </button>
                  ))}
                </div>
              </QuestionCard>
              <QuestionCard title={t.form.resolvedFast}>
                <YesNoChoice
                  value={form.resolutionSpeed}
                  note={form.resolutionNote}
                  onChoose={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      resolutionSpeed: value,
                      resolutionNote:
                        prev.resolutionSpeed === value ? prev.resolutionNote : "",
                    }))
                  }
                  onNote={(resolutionNote) => update("resolutionNote", resolutionNote)}
                />
              </QuestionCard>
              <QuestionCard title={t.form.communication}>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {COMMUNICATION.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            communication: item.value,
                            communicationNote:
                              communicationKind(prev.communication) ===
                              communicationKind(item.value)
                                ? prev.communicationNote
                                : "",
                          }))
                        }
                        className={`flex h-14 flex-col items-center justify-center rounded-xl border ${
                          form.communication === item.value
                            ? "border-primary bg-nubia-light"
                            : "border-border bg-white"
                        }`}
                      >
                        <span className="text-lg leading-none">{item.emoji}</span>
                        <span className="mt-1 text-xs font-semibold">
                          {optionLabel(locale, "communication", item.value)}
                        </span>
                      </button>
                    ))}
                  </div>
                  {communicationPrompt(form.communication, t.form.praise, t.form.explain) ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {communicationPrompt(form.communication, t.form.praise, t.form.explain)}{" "}
                        <span>{t.common.optional}</span>
                      </p>
                      <textarea
                        value={form.communicationNote}
                        onChange={(event) =>
                          update("communicationNote", event.target.value.slice(0, 500))
                        }
                        rows={2}
                        placeholder={t.common.writeHere}
                        className="w-full rounded-xl border border-border bg-white p-2.5 text-sm text-navy outline-none placeholder:text-muted-foreground focus:border-primary"
                      />
                    </div>
                  ) : null}
                </div>
              </QuestionCard>
            </>
          )}

          {step === 4 && (
            <CommentBox
              value={form.comment}
              onChange={(v) => update("comment", v)}
            />
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
        nextLabel={
          step === 5 ? t.common.send : step === 4 ? t.common.review : t.common.continue
        }
        backLabel={t.common.back}
        loading={submitting}
      />
    </div>
  );
}
