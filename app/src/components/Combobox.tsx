import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ReactNode } from 'react';

type ComboboxProps = React.ComponentProps<'div'> & {
  inputProps?: React.ComponentProps<typeof Input>;
  value: string;
  setValue: (value: string) => void;
  renderResults: ReactNode;
};

export default function Combobox({
  className,
  inputProps,
  value,
  setValue,
  renderResults,
  ...props
}: ComboboxProps) {
  return (
    <div className={cn(className)} {...props}>
      <Popover open={value.length > 0}>
        <PopoverTrigger asChild>
          <Input
            type='text'
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder='Search airports...'
            {...inputProps}
          />
        </PopoverTrigger>
        <PopoverContent
          className='w-[var(--radix-popover-trigger-width)]'
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {renderResults}
        </PopoverContent>
      </Popover>
    </div>
  );
}
