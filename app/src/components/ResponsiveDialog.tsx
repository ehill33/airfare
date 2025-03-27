import useMediaQuery from '@/hooks/useMediaQuery';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';

type ResponsiveDialogProps = {
  title: string;
  Trigger: React.ReactNode;
  Content: React.ReactNode;
  Footer: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

function ResponsiveDialog({
  title,
  Trigger,
  Content,
  Footer,
  isOpen,
  setIsOpen,
}: ResponsiveDialogProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{Trigger}</DrawerTrigger>
        <DrawerContent className='p-4'>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          {Content}
          {Footer}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className=''>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {Content}
        {Footer}
      </DialogContent>
    </Dialog>
  );
}
export default ResponsiveDialog;
