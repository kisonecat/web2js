@x
@p procedure fix_date_and_time;
begin time:=12*60; {minutes since midnight}
day:=4; {fourth day of the month}
month:=7; {seventh month of the year}
year:=1776; {Anno Domini}
end;
@y
@p procedure fix_date_and_time;
begin time:=currentminutes; {minutes since midnight}
day:=currentday; {fourth day of the month}
month:=currentmonth; {seventh month of the year}
year:=currentyear; {Anno Domini}
end;
@z
