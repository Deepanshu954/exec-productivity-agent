export interface VoiceNote {
  id: string;
  date: string;
  time: string;
  day: string;
  context: string;
  transcript: string;
}

export const voiceNotes: VoiceNote[] = [
  {
    id: 'vn-1',
    date: '2026-09-21',
    time: '6:40 PM',
    day: 'Monday',
    context: 'Recorded in cab',
    transcript: "Quick note to self — need to get Raghav that vendor list, I think I said today but it might slip to tomorrow morning, remind me. Also still haven't heard back on the Mumbai lease thing, someone needs to own that, I don't think it's me.",
  },
  {
    id: 'vn-2',
    date: '2026-09-23',
    time: '8:15 AM',
    day: 'Wednesday',
    context: 'Morning reminder',
    transcript: "Reminder — expense variance report from Divya needs to be in my hands by Wednesday evening, not Thursday, I want time to go through it before board prep. Also Meridian call — I owe Priya a time, need to lock that in today.",
  },
];
