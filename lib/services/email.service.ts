import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailService = {
  async sendBookingConfirmation(
    booking: {
      name: string;
      email: string;
      title: string;
      start_time: Date;
      end_time: Date;
      meet_link?: string;
    },
    organizer_email: string
  ) {
    await resend.emails.send({
      from: "TimelyMeet <noreply@timelymeet.com>",
      to: [booking.email, organizer_email],
      subject: `Booking confirmed for ${booking.title}`,
      html: `
        <h2>Booking Confirmed</h2>
        <p>Hello ${booking.name},</p>
        <p>Your booking for <strong>${booking.title}</strong> has been confirmed.</p>
        <p><strong>When:</strong> ${new Date(booking.start_time).toLocaleString()} - ${new Date(
        booking.end_time
      ).toLocaleString()}</p>
        ${
          booking.meet_link
            ? `<p><strong>Join Meeting:</strong> <a href="${booking.meet_link}">${booking.meet_link}</a></p>`
            : ""
        }
        <p>Thanks,<br/>TimelyMeet</p>
      `,
    });
  },

  async sendFinalizedPollEmails(event: any, meetLink: string) {
    const attendees = event.poll_options.flatMap((opt: any) =>
      opt.votes.map((v: any) => v.voter_email)
    );
    const uniqueEmails = [...new Set(attendees)];

    await resend.emails.send({
      from: "TimelyMeet <noreply@timelymeet.com>",
      to: uniqueEmails as string[],
      subject: `Poll Finalized: ${event.title}`,
      html: `
        <h2>Poll Finalized</h2>
        <p>The poll <strong>${event.title}</strong> has been finalized by ${event.user.name}.</p>
        <p><strong>Final Time:</strong> ${new Date(
          event.poll_options.find((o: any) => o.id === event.finalized_option_id)?.start_time
        ).toLocaleString()}</p>
        <p><strong>Join Meeting:</strong> <a href="${meetLink}">${meetLink}</a></p>
        <p>See you there!</p>
      `,
    });
  },
};
