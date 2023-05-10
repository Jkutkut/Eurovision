interface Props {
    country: string;
    artist: string;
    song: string;
    link: string;
    points: number;
    // index: number;
    // enabled: boolean;
    // editable: boolean;
}

const Song = ({ country, artist, song, link, points }: Props) => {
    return <div className="row align-items-start" key={country}>
        <div className="col">{country}</div>
        <div className="col">{artist}</div>
        <div className="col">{song}</div>
        <div className="col"><a href={link} target="_blank">Link</a></div>
        <div className="col">{points}</div>
    </div>;
}

export default Song;