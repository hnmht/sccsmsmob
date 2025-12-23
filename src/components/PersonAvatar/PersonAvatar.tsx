import { Avatar } from "react-native-paper";

interface PersonAvatarProps {
    url: string | undefined;
    isOffLine: number;
    name: string;
}

function PersonAvatar({ url, isOffLine, name }: PersonAvatarProps) {
    const displayIcon = url === "" || url === undefined || isOffLine === 1;
    return (
        displayIcon
            ? <Avatar.Text size={48} label={name.charAt(0).toUpperCase()} />
            : <Avatar.Image size={48} source={{ uri: url }} onError={(err) => console.error(err)} />
    );
};

export default PersonAvatar;