import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Contact = () => {
  return (
    <div className="px-2 pt-6 md:w-2/3 md:mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="mr-2">🎱</span> Ứng dụng tính điểm
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p>
            Gặp bất cứ lỗi gì liên hệ facebook:{" "}
            <a
              href="https://www.facebook.com/ebs.bi/"
              className="text-blue-500"
              target="_blank"
            >
              Minh Nhân
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;
