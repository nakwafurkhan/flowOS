# Task Board

Statuses: `BACKLOG`, `READY`, `IN PROGRESS`, `BLOCKED`, `IN REVIEW`,
`DONE`.

Only move a task to `READY` after its dependencies and acceptance
criteria are clear. Do not start implementation while the project is in
planning status.

  ----------------------------------------------------------------------------
  ID             Task             Status         Owner          Dependencies
  -------------- ---------------- -------------- -------------- --------------
  GOV-001        Review and       BACKLOG        Human owner    None
                 approve project                                
                 charter                                        

  GOV-002        Confirm ERPNext  BACKLOG        Human owner    None
                 version, hosting                               
                 and                                            
                 customisations                                 

  GOV-003        Confirm user     BACKLOG        Human owner /  GOV-001
                 roles and                       finance        
                 authorisation                                  
                 model                                          

  GOV-004        Resolve business DONE           Human owner /  GOV-002
                 rules in open                   finance        
                 questions                                      

  GOV-005        Approve          DONE           Human owner    GOV-002,
                 architecture and                               GOV-003
                 LLM                                            
                 data-handling                                  
                 policy                                         

  GOV-006        Configure Git    BACKLOG        Human owner    GOV-001
                 protections and                                
                 contributor                                    
                 process                                        

  INT-001        Implement        BLOCKED        TBD            GOV-002,
                 read-only                                      GOV-005
                 ERPNext API                                    
                 adapter                                        

  INT-002        Implement        BLOCKED        TBD            INT-001
                 customer lookup                                
                 and                                            
                 disambiguation                                 

  FIN-001        Select           BLOCKED        Finance owner  GOV-004
                 authoritative                                  
                 receivables                                    
                 source and                                     
                 filters                                        

  FIN-002        Implement        BLOCKED        TBD            FIN-001
                 balance summary                                
                 with                                           
                 reconciliation                                 
                 tests                                          

  FIN-003        Approve and      BLOCKED        Finance owner  GOV-004
                 implement credit                / developer    
                 exposure formula                               

  FIN-004        Implement        BLOCKED        TBD            FIN-001
                 invoice ageing                                 
                 and drill-down                                 

  UI-001         Design customer  BLOCKED        TBD            GOV-001,
                 search and                                     GOV-004
                 summary views                                  

  AI-001         Add constrained  BLOCKED        TBD            INT-002,
                 tool-calling                                   FIN-002
                 orchestration                                  

  SEC-001        Security and     BLOCKED        Human reviewer INT-001,
                 access-control                                 AI-001
                 review                                         

  QA-001         End-to-end tests BLOCKED        Human owner /  INT-001,
                 and user                        QA             FIN-002,
                 acceptance                                     FIN-004,
                                                                UI-001, AI-001
  ----------------------------------------------------------------------------

## Task assignment protocol

Before work starts, record the assignee and branch in the task row or
task issue. Avoid assigning overlapping file ownership to parallel
agents. Every task needs acceptance criteria, tests and a review owner
before it is marked `READY`.
