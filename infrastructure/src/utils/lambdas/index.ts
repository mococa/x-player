import { apigateway } from "@pulumi/awsx/classic";

export class HttpError extends Error {
  status: number;
  message: string;

  constructor({ message, status }: { message: string; status: number }) {
    super();

    this.status = status;
    this.message = message;

    throw { message, status };
  }
}

export const get_body = (event: apigateway.Request) => {
  try {
    const { body } = event;
    if (!body) throw new HttpError({ message: "Body is missing", status: 400 });

    const parsed_body = JSON.parse(body || "{}").catch(() => {
      throw new HttpError({ message: "Failed to parse body", status: 400 });
    });

    return { body: parsed_body };
  } catch (error) {
    throw error;
  }
};

export const http_response = ({
  body,
  status,
}: {
  body: unknown;
  status: number;
}) => {
  return { statusCode: status, body: JSON.stringify(body) };
};

export const id = () => Math.random().toString(36).substring(2, 15);
