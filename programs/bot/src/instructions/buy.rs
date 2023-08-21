use anchor_lang::{prelude::{*, thiserror::__private::DisplayAsDisplay}, solana_program::instruction::Instruction, solana_program::system_program};
use anchor_spl::{token::{self, Token, Mint, TokenAccount}, associated_token::{AssociatedToken}};
use ::borsh::BorshSerialize;
use winnow::number::u8;
use std::convert::TryFrom;
use byteorder::{ByteOrder, LittleEndian};

use clockwork_sdk::state::ExecContext;
use std::mem::size_of;
use byteorder::BigEndian;
use byteorder::WriteBytesExt;
use clockwork_sdk::ID;
use byteorder::ReadBytesExt;
use crate::Authority;
use std::convert::TryInto;
use solana_program::program::{invoke_signed,invoke};
use anchor_lang::Discriminator;
use whirlpools::{*, self, state::*};
use anchor_lang::ZeroCopy;
use std::io::Read;
use winnow::stream::{AsBStr, AsBytes};
use std::{str::FromStr, io::{Cursor, Write}, borrow::BorrowMut};
use { 
  clockwork_sdk::{
      state::{Thread, ThreadAccount, ThreadResponse},
  }
};
#[derive(Accounts)]
pub struct Buy<'info> {
    #[account(mut, address = authority.pubkey(), signer)]
    pub authority: Account<'info, Thread>,
  #[account(mut, owner = Pubkey::from_str("SVBzw5fZRY9iNRwy5JczFYni2X9aDqur6HhAP1CXX7T").unwrap())]
  pub contract: UncheckedAccount<'info>,
  #[account(mut)]
  pub game_user: UncheckedAccount<'info>,
  #[account(mut)]

  pub contract_token_account: UncheckedAccount<'info>,
  #[account(mut)]
  pub buyer_token_account: Box<Account<'info, TokenAccount>>,
  pub instruction_sysvar_account: UncheckedAccount<'info>,
  #[account(mut)]
  pub raffle: UncheckedAccount<'info>,
  pub token_program: Program<'info, Token>,
  pub system_program: Program<'info, System>,
  pub whirlpool_program: UncheckedAccount<'info>,
  pub thread_program: UncheckedAccount<'info>,

}



pub fn handler(
    ctx: Context<Buy>,
  
    game_index: u32,
    qty: u32,
    threadName: String,
  ) ->   
  Result<ThreadResponse> {
//if ( diff < seconds as u32) {
      let cpi_program = ctx.accounts.whirlpool_program.to_account_info();
        
    let cpi_accounts = whirlpools::state::Buy {
      dev: ctx.accounts.dev.to_account_info(),
      authority: ctx.accounts.authority.to_account_info(),
      contract: ctx.accounts.contract.to_account_info(),
      game_user: ctx.accounts.game_user.to_account_info(),
      contract_token_account: ctx.accounts.contract_token_account.to_account_info(),
      buyer_token_account: ctx.accounts.buyer_token_account.to_account_info(),
      instruction_sysvar_account: ctx.accounts.instruction_sysvar_account.to_account_info(),
      raffle: ctx.accounts.raffle.to_account_info(),
      token_program: ctx.accounts.token_program.to_account_info(),
      system_program: ctx.accounts.system_program.to_account_info()
    };
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    let mut data = vec![];
    let mut cursor = Cursor::new(&mut data);
    cursor.write_u32::<LittleEndian>(game_index).unwrap();
    cursor.write_u32::<LittleEndian>(qty).unwrap();
    
    whirlpools::cpi::buy(cpi_ctx, game_index, qty)?;
//aurhoritypubkey-0-{qty}-1"
    let mut memo = String::from(&ctx.accounts.authority.pubkey().to_string());
    memo.push_str("-0-");
    memo.push_str(&qty.to_string());
    memo.push_str("-1");
   
let ix2 = Instruction {
  program_id: Pubkey::new_from_array([
      6,  94,  57,  70,  77,  84,  31,  75,  66,  58,  98,  82,  92,  28,  17,  98,
      117,  16,  56,  92,  16,  94,  47,  67,  113,  88,  103,  68,  76,  71, 109, 102,
  ]),
  accounts: vec![AccountMeta::new_read_write(
      &user.public_key,
      true,
  )],
  data: format!("{}-0-{}-1", user.public_key.to_string(), qty).into_bytes(),
};
invoke(ix2, ctx.accounts.system_program.to_account_info())?;
      
      Ok(ThreadResponse {
        next_instruction: None,
              kickoff_instruction: None,
          })
    }
  

