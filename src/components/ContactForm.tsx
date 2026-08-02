"use client";

import { useState, type FormEvent } from "react";
import { treks } from "@/data/treks";

export default function ContactForm() {
    const [note, setNote] = useState(
        "This is a demo form — no data is actually sent anywhere."
    );
    const [noteColor, setNoteColor] = useState<string | undefined>(undefined);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setNote(
            "Thanks — this demo form doesn't send data, but on a live site this is where your enquiry would go."
        );
        setNoteColor("#4b7a5f");
    }

    return (
        <form id="enquiryForm" onSubmit={handleSubmit}>
            <div className="form-grid">
                <div className="field">
                    <label htmlFor="fname">Full Name</label>
                    <input type="text" id="fname" name="fname" required />
                </div>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div className="field">
                    <label htmlFor="trek">Trek Interested In</label>
                    <select id="trek" name="trek" defaultValue="">
                        <option value="" disabled>
                            Choose a trek
                        </option>
                        {treks.map((t) => (
                            <option key={t.slug} value={t.name}>
                                {t.name}
                            </option>
                        ))}
                        <option value="not-sure">Not sure yet — suggest one</option>
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="dates">Preferred Dates</label>
                    <input
                        type="text"
                        id="dates"
                        name="dates"
                        placeholder="e.g. March 2027"
                    />
                </div>
                <div className="field full">
                    <label htmlFor="msg">Anything else we should know?</label>
                    <textarea
                        id="msg"
                        name="msg"
                        placeholder="Group size, fitness level, prior trekking experience..."
                    />
                </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: 24 }}>
                Send Enquiry
            </button>
            <p className="form-note" id="formNote" style={noteColor ? { color: noteColor } : undefined}>
                {note}
            </p>
        </form>
    );
}
