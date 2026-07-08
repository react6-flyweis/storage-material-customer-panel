type TitleSubtitleProps = {
  title: string;
  subtitle: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

const TitleSubtitle: React.FC<TitleSubtitleProps> = ({
  title,
  subtitle,
  titleClassName = "",
  subtitleClassName = "",
}) => {
  return (
    <div className="flex items-start gap-1 flex-col">
      <h1
        className={`font-inter xl:text-3xl text-xl font-normal text-(--text-color-black) md:mb-2 mb-1 ${titleClassName}`}
      >
        {title}
      </h1>
      <p
        className={`text-(--text-color-gray-2) md:text-base font-normal text-sm ${subtitleClassName}`}
      >
        {subtitle}
      </p>
    </div>
  );
};

export default TitleSubtitle;
