/**
 * BmiCalculator — the working "Fitness & Preparation" calculator.
 *
 * Lets the visitor work out their BMI in metric or imperial units, shows the
 * category on the classic WHO scale, and frames the result in a trekking
 * context (what it means for high-altitude walking). Fully self-contained —
 * no external data, no invented medical claims.
 */
"use client";

import { useMemo, useState } from "react";

type Units = "metric" | "imperial";

interface BmiResult {
    value: number;
    category: string;
    tone: "low" | "ok" | "high";
    note: string;
}

function bmiFor(heightM: number, weightKg: number): BmiResult {
    if (!heightM || !weightKg) {
        return { value: 0, category: "—", tone: "ok", note: "" };
    }
    const value = weightKg / (heightM * heightM);
    let category: string;
    let tone: "low" | "ok" | "high";
    let note: string;
    if (value < 18.5) {
        category = "Underweight";
        tone = "low";
        note = "Consider adding some strength and calories before you go — you will burn a lot on the trail.";
    } else if (value < 25) {
        category = "Normal range";
        tone = "ok";
        note = "A good starting point for multi-day trekking. Focus on cardio and stamina in the weeks before you leave.";
    } else if (value < 30) {
        category = "Overweight";
        tone = "high";
        note = "Very common and absolutely workable — a few months of regular walking and stair climbing goes a long way.";
    } else {
        category = "Obese";
        tone = "high";
        note = "Talk to your doctor about a training plan first. Many of our guests build up to high-altitude treks over a season.";
    }
    return { value, category, tone, note };
}

export default function BmiCalculator() {
    const [units, setUnits] = useState<Units>("metric");
    const [metric, setMetric] = useState({ heightCm: 170, weightKg: 70 });
    const [imperial, setImperial] = useState({ heightFt: 5, heightIn: 8, weightLb: 155 });

    const result = useMemo(() => {
        if (units === "metric") {
            const heightM = metric.heightCm / 100;
            return bmiFor(heightM, metric.weightKg);
        }
        const heightM = (imperial.heightFt * 12 + imperial.heightIn) * 0.0254;
        const weightKg = imperial.weightLb * 0.45359237;
        return bmiFor(heightM, weightKg);
    }, [units, metric, imperial]);

    return (
        <div className="bmi-card">
            <div className="bmi-tabs" role="tablist" aria-label="Measurement units">
                <button
                    type="button"
                    role="tab"
                    aria-selected={units === "metric"}
                    className={units === "metric" ? "bmi-tab is-active" : "bmi-tab"}
                    onClick={() => setUnits("metric")}
                >
                    Metric
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={units === "imperial"}
                    className={units === "imperial" ? "bmi-tab is-active" : "bmi-tab"}
                    onClick={() => setUnits("imperial")}
                >
                    Imperial
                </button>
            </div>

            <div className="bmi-inputs">
                {units === "metric" ? (
                    <>
                        <label className="bmi-field">
                            <span>Height (cm)</span>
                            <input
                                type="number"
                                min="100"
                                max="250"
                                value={metric.heightCm}
                                onChange={(e) =>
                                    setMetric({ ...metric, heightCm: Number(e.target.value) })
                                }
                            />
                        </label>
                        <label className="bmi-field">
                            <span>Weight (kg)</span>
                            <input
                                type="number"
                                min="30"
                                max="250"
                                value={metric.weightKg}
                                onChange={(e) =>
                                    setMetric({ ...metric, weightKg: Number(e.target.value) })
                                }
                            />
                        </label>
                    </>
                ) : (
                    <>
                        <label className="bmi-field">
                            <span>Height (ft)</span>
                            <input
                                type="number"
                                min="3"
                                max="8"
                                value={imperial.heightFt}
                                onChange={(e) =>
                                    setImperial({ ...imperial, heightFt: Number(e.target.value) })
                                }
                            />
                        </label>
                        <label className="bmi-field">
                            <span>Height (in)</span>
                            <input
                                type="number"
                                min="0"
                                max="11"
                                value={imperial.heightIn}
                                onChange={(e) =>
                                    setImperial({ ...imperial, heightIn: Number(e.target.value) })
                                }
                            />
                        </label>
                        <label className="bmi-field">
                            <span>Weight (lb)</span>
                            <input
                                type="number"
                                min="70"
                                max="550"
                                value={imperial.weightLb}
                                onChange={(e) =>
                                    setImperial({ ...imperial, weightLb: Number(e.target.value) })
                                }
                            />
                        </label>
                    </>
                )}
            </div>

            <div className={`bmi-result bmi-result--${result.tone}`}>
                <div className="bmi-score">
                    <strong>{result.value ? result.value.toFixed(1) : "—"}</strong>
                    <span>BMI</span>
                </div>
                <div className="bmi-cat">
                    <strong>{result.category}</strong>
                    {result.note && <p>{result.note}</p>}
                </div>
            </div>

            <p className="bmi-disclaimer">
                BMI is a rough screening measure, not a fitness diagnosis. Speak with your
                doctor before training for or joining a high-altitude trek, especially if you
                have any pre-existing condition.
            </p>
        </div>
    );
}
