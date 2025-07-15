interface MeetingListProps {
    meetings: any,
    type: string
}

const MeetingList = ({ meetings, type }: MeetingListProps) => {
    console.log('meeting:', { typeOf: typeof (meetings), meetings }, 'types:', { typeOf: typeof (type), type });
    return (
        <div>

        </div>
    )
}

export default MeetingList;