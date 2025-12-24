import { APP_INFO, VERSION_STRING } from "@/const/app";

const FooterContact = () => {
  return (
    <p className="mt-8 text-center text-[10px] opacity-40 uppercase tracking-[0.3em]">
      {APP_INFO.name} {VERSION_STRING}
    </p>
  );
};

export default FooterContact;
