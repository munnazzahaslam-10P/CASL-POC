import { Action } from "../enums/action.enum";
import { Subjects } from "../authorization.factory";

//interface for defining policy handler
export interface IPolicyHandler {
  action: Action,
  subjects: Subjects
}