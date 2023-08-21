use anchor_lang::prelude::*;
use anchor_lang::{prelude::*, solana_program::instruction::Instruction};
use anchor_spl::{token::{self, Token, Mint, TokenAccount}, associated_token::{AssociatedToken}};
use whirlpools::{self, state::*};

mod instructions;
use instructions::*;
use { 
  clockwork_sdk::{
      state::{ThreadResponse},
  }
};
declare_id!("JqVpRRhEPXpc9zDZWNWKpsBHAESEft7ogXGjH7MV4bS");
#[account]
pub struct Authority {
  pub authority: Pubkey,
  pub bump: u8,
}
#[program]
pub mod bot {
    use buy::Buy;
    use super::*;

    pub fn buy(
        ctx: Context<Buy>,
        game_index: u32,
        qty: u32,
        threadName: String
      ) -> Result<ThreadResponse> {
          return instructions::buy::handler(
            ctx,
            
            game_index,
            qty,
            threadName
          );
        }
      }
