export type standardResponse = {
  status: number;
  statusText: "success" | "failed" | "error" | "bad request";
  message: string;
  data?: Array<Record<any, any>> | Record<any, any> | null;
};

export class ResponseManager {
  public static standardResponse(response: standardResponse) {
    return response;
  }
}
