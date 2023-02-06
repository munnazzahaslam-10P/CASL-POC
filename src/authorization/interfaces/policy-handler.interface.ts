import { Action } from "../enums/action.enum";
import { Subjects } from "../authorization.factory";

export interface IPolicyHandler {
  action: Action,
  subjects: Subjects
}