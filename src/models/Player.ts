import { COLORS } from "../utils/Constants";

export default class Player {
  constructor(
    private m_name: string,
    private m_color: COLORS,
    private m_turn: boolean
  ) {}
}
