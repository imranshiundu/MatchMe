type IconProps = {
    name: string;
    className?: string;
    size?: number;
};

function Icon({ name, className = '', size = 18 }: IconProps) {
    return(
        <svg className={className} width={size} height={size}>
            <use href={`/icons.svg#${name}`}/>
        </svg>
    )
}

export default Icon;
