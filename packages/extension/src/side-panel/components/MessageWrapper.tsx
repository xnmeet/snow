import clsx from 'clsx';

export interface MessageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const MessageWrapper = ({ children, className }: MessageWrapperProps) => {
  return (
    <div className={clsx('flex max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm', className)}>
      {children}
    </div>
  );
};
